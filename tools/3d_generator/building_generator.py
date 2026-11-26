#!/usr/bin/env python3
"""
GateLite 3D Building Generator
Generates 3D building models (GLTF/GLB) from society data
Supports procedural generation of residential buildings with flats, windows, balconies, etc.
"""

import json
import math
import os
import sys
from dataclasses import dataclass, field
from typing import List, Dict, Optional, Tuple
from pathlib import Path

import numpy as np
import trimesh
import pygltflib


@dataclass
class Flat:
    flat_number: str
    floor: int
    occupied: bool = False
    resident: Optional[str] = None
    flat_type: str = "OWNER"  # OWNER, TENANT, FAMILY


@dataclass
class Building:
    id: str
    name: str
    block_name: str
    position: Tuple[float, float, float]  # x, y, z
    dimensions: Tuple[float, float, float]  # width, height, depth
    floors: int
    flats_per_floor: int
    color: str = "#B8F2D0"
    flats: List[Flat] = field(default_factory=list)
    flat_number: Optional[str] = None


@dataclass
class Block:
    id: str
    name: str
    position: Tuple[float, float, float]
    buildings: List[Building] = field(default_factory=list)


@dataclass
class Society:
    id: str
    name: str
    blocks: List[Block] = field(default_factory=list)


class BuildingGenerator:
    """Generates 3D building models from society data."""
    
    # Architectural constants
    FLOOR_HEIGHT = 3.0  # meters
    BASE_HEIGHT = 0.5   # meters
    ROOF_HEIGHT = 1.0   # meters
    WINDOW_HEIGHT = 1.8
    WINDOW_WIDTH = 1.2
    BALCONY_DEPTH = 0.8
    BALCONY_HEIGHT = 1.1
    WALL_THICKNESS = 0.2
    ROOF_OVERHANG = 0.5
    
    # Colors (hex strings)
    COLORS = {
        'mint': '#B8F2D0',
        'sky': '#BFE3FF',
        'lilac': '#D9C6FF',
        'peach': '#FFD3B6',
        'butter': '#FFF1A8',
        'rose': '#FFC2D1',
        'tomato': '#FF5A4E',
        'ink': '#111111',
        'paper': '#FFFBF2',
        'white': '#FFFFFF',
    }
    
    OCCUPANCY_COLORS = {
        'occupied': '#FFC2D1',   # rose
        'vacant': '#B8F2D0',     # mint
    }

    def __init__(self, output_dir: str = "output"):
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(parents=True, exist_ok=True)
        self.scene = trimesh.Scene()
        self.materials = {}
        self.meshes = []

    def hex_to_rgb(self, hex_color: str) -> Tuple[float, float, float]:
        """Convert hex color to RGB tuple (0-1 range)."""
        hex_color = hex_color.lstrip('#')
        return tuple(int(hex_color[i:i+2], 16) / 255.0 for i in (0, 2, 4))

    def create_material(self, color: str, name: str = None, emissive: str = None, 
                       emissive_intensity: float = 0, transparent: bool = False,
                       opacity: float = 1.0, metalness: float = 0.0, roughness: float = 0.7) -> pygltflib.Material:
        """Create a PBR material."""
        base_color = self.hex_to_rgb(color) + (1.0,)
        
        material = pygltflib.Material(
            name=name,
            pbrMetallicRoughness=pygltflib.PbrMetallicRoughness(
                baseColorFactor=list(base_color),
                metallicFactor=metalness,
                roughnessFactor=roughness,
            ),
            doubleSided=True,
        )
        
        if emissive:
            emissive_rgb = self.hex_to_rgb(emissive)
            material.emissiveFactor = list(emissive_rgb) + [emissive_intensity]
        
        if transparent:
            material.alphaMode = "BLEND"
            # Note: alphaCutoff would need extension
        
        return material

    def create_building_mesh(self, building: Building) -> trimesh.Trimesh:
        """Generate a building mesh with all architectural details."""
        width, height, depth = building.dimensions
        x, y, z = building.position
        
        # Calculate derived dimensions
        floor_height = (height - self.BASE_HEIGHT - self.ROOF_HEIGHT) / building.floors
        
        meshes = []
        
        # 1. Base/Foundation
        base_mesh = self._create_box(
            width, self.BASE_HEIGHT, depth,
            [x, self.BASE_HEIGHT/2, z],
            self.COLORS['ink'],
            "base"
        )
        meshes.append(base_mesh)
        
        # 2. Floors
        for floor in range(building.floors):
            floor_y = self.BASE_HEIGHT + floor * floor_height + floor_height / 2
            floor_color = self.COLORS['ink'] if floor == 0 else building.color
            
            # Floor slab
            slab = self._create_box(
                width, floor_height * 0.15, depth,
                [x, self.BASE_HEIGHT + floor * floor_height + floor_height * 0.075, z],
                floor_color,
                f"floor_slab_{floor}"
            )
            meshes.append(slab)
            
            # Floor walls (with windows)
            wall_height = floor_height * 0.85
            wall_y = self.BASE_HEIGHT + floor * floor_height + floor_height * 0.15 + wall_height / 2
            
            # Front wall (with windows)
            front_wall = self._create_wall_with_windows(
                width, wall_height, depth,
                building.flats_per_floor,
                [x, self.BASE_HEIGHT + floor * floor_height + floor_height * 0.15 + wall_height/2, z + depth/2],
                building.color,
                floor,
                building.flats_per_floor
            )
            meshes.append(front_wall)
            
            # Back wall
            back_wall = self._create_box(
                width, wall_height, self.WALL_THICKNESS,
                [x, self.BASE_HEIGHT + floor * floor_height + floor_height * 0.15 + wall_height/2, z - depth/2],
                building.color,
                f"back_wall_{floor}"
            )
            meshes.append(back_wall)
            
            # Side walls
            for side_x in [-width/2, width/2]:
                side_wall = self._create_box(
                    self.WALL_THICKNESS, wall_height, depth - 2 * self.WALL_THICKNESS,
                    [x + side_x, self.BASE_HEIGHT + floor * floor_height + floor_height * 0.15 + wall_height/2, z],
                    building.color,
                    f"side_wall_{floor}_{'left' if side_x < 0 else 'right'}"
                )
                meshes.append(side_wall)
            
            # Balconies
            balcony_meshes = self._create_balconies(
                building, floor, floor_height
            )
            meshes.extend(balcony_meshes)
        
        # 3. Roof
        roof_y = self.BASE_HEIGHT + building.floors * floor_height + self.ROOF_HEIGHT / 2
        roof = self._create_roof(
            width, depth, self.ROOF_HEIGHT,
            [x, roof_y, z],
            building.color
        )
        meshes.append(roof)
        
        # Combine all meshes
        combined = trimesh.util.concatenate(meshes)
        return combined

    def _create_box(self, width: float, height: float, depth: float, 
                    position: List[float], color: str, name: str) -> trimesh.Trimesh:
        """Create a simple box mesh."""
        box = trimesh.creation.box(extents=[width, height, depth])
        box.apply_translation(position)
        
        # Create visual
        visual = trimesh.visual.ColorVisuals()
        color_rgb = self.hex_to_rgb(color) + (1.0,)
        box.visual = visual
        box.visual.vertex_colors = np.tile(np.array(color_rgb) * 255, (len(box.vertices), 1)).astype(np.uint8)
        
        return box

    def _create_wall_with_windows(self, width: float, height: float, depth: float,
                                   flats_per_floor: int, position: List[float],
                                   color: str, floor: int, flats_per_floor_total: int) -> trimesh.Trimesh:
        """Create a wall with window cutouts."""
        wall = trimesh.creation.box(extents=[width, height, self.WALL_THICKNESS])
        wall.apply_translation([position[0], position[1], position[2]])
        
        # Cut out windows using boolean operations
        window_width = (width * 0.7) / flats_per_floor
        window_height = height * 0.6
        window_y = position[1]
        window_z = position[2]  # At front face
        
        for flat_idx in range(flats_per_floor):
            window_x = position[0] - width/2 + (flat_idx + 0.5) * width / flats_per_floor
            
            # Create window opening (subtract from wall)
            window_box = trimesh.creation.box(
                extents=[window_width * 0.7, window_height, self.WALL_THICKNESS * 2]
            )
            window_box.apply_translation([window_x, window_y, window_z])
            
            # Boolean difference (wall - window)
            wall = wall.difference(window_box)
        
        return wall

    def _create_balconies(self, building: Building, floor: int, floor_height: float) -> List[trimesh.Trimesh]:
        """Create balcony meshes for a floor."""
        meshes = []
        balcony_width = (building.dimensions[0] * 0.75) / building.flats_per_floor
        balcony_depth = self.BALCONY_DEPTH
        balcony_height = self.BALCONY_HEIGHT
        
        floor_y = self.BASE_HEIGHT + floor * building.dimensions[1] / building.floors + floor_height * 0.15 + 0.5
        
        for flat_idx in range(building.flats_per_floor):
            balcony_x = building.position[0] - building.dimensions[0] * 0.75 / 2 + \
                       (flat_idx + 0.5) * building.dimensions[0] * 0.75 / building.flats_per_floor
            balcony_y = self.BASE_HEIGHT + floor * building.dimensions[1] / building.floors + floor_height * 0.15 + 0.5
            balcony_z = building.position[2] + building.dimensions[2] / 2 + balcony_depth / 2 + 0.1
            
            balcony = trimesh.creation.box(
                extents=[balcony_width, 0.1, balcony_depth]
            )
            balcony.apply_translation([balcony_x, balcony_y, balcony_z])
            
            # Railing
            railing = trimesh.creation.box(
                extents=[building.dimensions[0] * 0.75 / building.flats_per_floor * 0.9, 0.8, 0.05]
            )
            railing.apply_translation([balcony_x, balcony_y + 0.45, balcony_z + balcony_depth/2 - 0.025])
            
            meshes.extend([balcony, railing])
        
        return meshes

    def _create_roof(self, width: float, depth: float, height: float,
                     position: List[float], color: str) -> trimesh.Trimesh:
        """Create a roof with overhang."""
        # Main roof slab
        roof = trimesh.creation.box(
            extents=[width + 2*self.ROOF_OVERHANG, height, depth + 2*self.ROOF_OVERHANG]
        )
        roof.apply_translation([
            position[0], 
            position[1], 
            position[2]
        ])
        
        # Parapet wall
        parapet = trimesh.creation.box(
            extents=[width + 2*self.ROOF_OVERHANG, 0.5, depth + 2*self.ROOF_OVERHANG]
        )
        parapet.apply_translation([
            position[0],
            position[1] + height/2 + 0.25,
            position[2]
        ])
        
        # Roof access structure
        access = trimesh.creation.box(extents=[width*0.4, 1.0, depth*0.4])
        access.apply_translation([
            position[0],
            position[1] + height + 0.5,
            position[2]
        ])
        
        combined = trimesh.util.concatenate([roof, parapet, access])
        return combined

    def create_society_scene(self, society: Society) -> trimesh.Scene:
        """Create a complete society scene with all blocks and buildings."""
        scene = trimesh.Scene()
        
        # Add ground plane
        ground = trimesh.creation.box(extents=[500, 0.2, 500])
        ground.apply_translation([0, -0.1, 0])
        scene.add_geometry(ground, node_name="ground")
        
        # Add grid lines as thin boxes
        self._add_grid_lines()
        
        # Add blocks and buildings
        for block in society.blocks:
            block_scene = self._create_block_node(block)
            # Add all geometries from block scene to main scene
            for geom_name, geometry in block_scene.geometry.items():
                scene.add_geometry(geometry, node_name=f"block_{block.id}_{geom_name}")
        
        # Add lighting info as metadata
        scene.metadata = {
            "lighting": {
                "ambient": [0.4, 0.4, 0.4, 1.0],
                "directional": {
                    "direction": [1, -1, 1],
                    "color": [1.0, 1.0, 0.95],
                    "intensity": 1.0
                },
                "hemisphere": {
                    "sky_color": [1.0, 1.0, 0.95],
                    "ground_color": [0.8, 0.8, 0.7],
                    "intensity": 0.8
                }
            },
            "camera": {
                "position": [40, 40, 40],
                "target": [0, 10, 0],
                "fov": 50
            }
        }
        
        return scene

    def _add_grid_lines(self):
        """Add grid lines to the scene."""
        # This would be handled in the renderer, not as geometry
        pass

    def _create_block_node(self, block: Block) -> trimesh.Scene:
        """Create a scene node for a block with all its buildings."""
        block_scene = trimesh.Scene()
        
        # Add block label (as metadata)
        block_scene.metadata = {
            "name": block.name,
            "building_count": len(block.buildings),
        }
        
        # Add buildings
        for building in block.buildings:
            building_mesh = self.create_building_mesh(building)
            building_node = trimesh.Scene()
            building_node.add_geometry(building_mesh)
            
            # Add flat occupancy as metadata
            if building.flats:
                building_node.metadata = {
                    "flats": [
                        {
                            "flat_number": f.flat_number,
                            "floor": f.floor,
                            "occupied": f.occupied,
                            "resident": f.resident,
                            "type": f.flat_type,
                        }
                        for f in building.flats
                    ]
                }
            
            # Add building geometry to block scene
            for geom_name, geometry in building_node.geometry.items():
                block_scene.add_geometry(geometry, node_name=f"{building.id}_{geom_name}")
        
        return block_scene

    def export_gltf(self, scene: trimesh.Scene, filename: str) -> str:
        """Export scene as GLTF/GLB."""
        output_path = self.output_dir / filename
        
        # Export using trimesh's built-in export
        if filename.endswith('.glb'):
            glb_data = trimesh.exchange.gltf.export_glb(scene)
            output_path.write_bytes(glb_data)
        else:
            gltf_data = trimesh.exchange.gltf.export_gltf(scene)
            output_path.write_text(json.dumps(gltf_data, indent=2))
        
        return str(output_path)

    def generate_flat_occupancy_json(self, society: Society, output_file: str = "flat_occupancy.json"):
        """Generate flat occupancy data as JSON for the 3D viewer."""
        data = {
            "society_id": society.id,
            "society_name": society.name,
            "blocks": []
        }
        
        for block in society.blocks:
            block_data = {
                "id": block.id,
                "name": block.name,
                "position": block.position,
                "buildings": []
            }
            
            for building in block.buildings:
                building_data = {
                    "id": building.id,
                    "name": building.name,
                    "block_name": block.name,
                    "position": building.position,
                    "dimensions": building.dimensions,
                    "floors": building.floors,
                    "flats_per_floor": building.flats_per_floor,
                    "color": building.color,
                    "flats": [
                        {
                            "flat_number": f.flat_number,
                            "floor": f.floor,
                            "occupied": f.occupied,
                            "resident": f.resident,
                            "type": f.flat_type,
                        }
                        for f in building.flats
                    ] if building.flats else []
                }
                block_data["buildings"].append(building_data)
            
            data["blocks"].append(block_data)
        
        output_path = self.output_dir / output_file
        output_path.write_text(json.dumps(data, indent=2))
        return str(output_path)


def generate_sample_society() -> Society:
    """Generate a sample society for testing."""
    society = Society(
        id="green-valley-001",
        name="Green Valley Society"
    )
    
    # Create 3 blocks
    block_names = ["A", "B", "C"]
    block_colors = ["#B8F2D0", "#BFE3FF", "#D9C6FF"]
    
    for i, (block_name, color) in enumerate(zip(block_names, block_colors)):
        block = Block(
            id=f"block-{block_name.lower()}",
            name=f"Block {block_name}",
            position=[i * 60 - 60, 0, 0]  # Spread blocks along X axis
        )
        
        # 5 buildings per block
        for b in range(5):
            building_x = (b - 2) * 25  # Spread buildings
            building_z = 0
            
            building = Building(
                id=f"{block.id}-bldg-{b+1}",
                name=f"{block_name}-{b+1:02d}",
                block_name=f"Block {block_name}",
                position=[block.position[0] + building_x, 0, building_z],
                dimensions=[18, 25, 12],  # width, height, depth
                floors=5,
                flats_per_floor=4,
                color=color,
            )
            
            # Generate flats
            flats = []
            for floor in range(5):
                for flat_idx in range(4):
                    flat_num = f"{floor+1}{flat_idx+1:02d}"
                    occupied = np.random.random() > 0.3  # 70% occupancy
                    flat_type = np.random.choice(["OWNER", "TENANT", "FAMILY"], p=[0.6, 0.3, 0.1])
                    
                    flat = Flat(
                        flat_number=f"{block_name}-{flat_num}",
                        floor=floor + 1,
                        occupied=bool(occupied),
                        resident=f"Resident {np.random.randint(100,999)}" if occupied else None,
                        flat_type=flat_type
                    )
                    flats.append(flat)
            
            building.flats = flats
            block.buildings.append(building)
        
        society.blocks.append(block)
    
    return society


def main():
    """Main entry point for CLI usage."""
    import argparse
    
    parser = argparse.ArgumentParser(description="GateLite 3D Building Generator")
    parser.add_argument("--output", "-o", default="output", help="Output directory")
    parser.add_argument("--format", "-f", choices=["glb", "gltf", "json"], default="glb", help="Output format")
    parser.add_argument("--society", "-s", help="Society JSON file")
    parser.add_argument("--sample", action="store_true", help="Generate sample society")
    
    args = parser.parse_args()
    
    generator = BuildingGenerator(args.output)
    
    if args.sample or not args.society:
        print("Generating sample society...")
        society = generate_sample_society()
    else:
        with open(args.society) as f:
            data = json.load(f)
            # Parse society from JSON
            society = parse_society_from_json(data)
    
    print(f"Generating 3D scene for {society.name}...")
    
    # Generate scene
    scene = generator.create_society_scene(society)
    
    # Export
    if args.format in ["glb", "gltf"]:
        filename = f"{society.id}.{args.format}"
        output_path = generator.export_gltf(scene, filename)
        print(f"Exported 3D model to: {output_path}")
    
    # Generate occupancy JSON
    json_path = generator.generate_flat_occupancy_json(society)
    print(f"Exported occupancy data to: {json_path}")
    
    # Print stats
    total_buildings = sum(len(b.buildings) for b in society.blocks)
    total_flats = sum(len(b.flats) for block in society.blocks for b in block.buildings if b.flats)
    print(f"\nSociety: {society.name}")
    print(f"Blocks: {len(society.blocks)}")
    print(f"Buildings: {total_buildings}")
    print(f"Total Flats: {total_flats}")


def parse_society_from_json(data: dict) -> Society:
    """Parse society from JSON data."""
    society = Society(id=data.get("id", "unknown"), name=data.get("name", "Unknown Society"))
    
    for block_data in data.get("blocks", []):
        block = Block(
            id=block_data["id"],
            name=block_data["name"],
            position=tuple(block_data.get("position", [0, 0, 0])),
        )
        
        for building_data in block_data.get("buildings", []):
            building = Building(
                id=building_data["id"],
                name=building_data["name"],
                block_name=building_data.get("block_name", ""),
                position=tuple(building_data.get("position", [0, 0, 0])),
                dimensions=tuple(building_data.get("dimensions", [18, 25, 12])),
                floors=building_data.get("floors", 5),
                flats_per_floor=building_data.get("flats_per_floor", 4),
                color=building_data.get("color", "#B8F2D0"),
            )
            
            if "flats" in building_data:
                building.flats = [
                    Flat(
                        flat_number=f["flat_number"],
                        floor=f["floor"],
                        occupied=f.get("occupied", False),
                        resident=f.get("resident"),
                        flat_type=f.get("flat_type", "OWNER"),
                    )
                    for f in building_data["flats"]
                ]
            
            block.buildings.append(building)
        
        society.blocks.append(block)
    
    return society


if __name__ == "__main__":
    main()