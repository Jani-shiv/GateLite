class User {
  final String id;
  final String phone;
  final String name;
  final String? avatarUrl;
  final String? societyId;
  final String? societyName;
  final String? flatId;
  final String? flatNumber;
  final String? role;
  final String? deviceId;
  
  const User({
    required this.id,
    required this.phone,
    required this.name,
    this.avatarUrl,
    this.societyId,
    this.societyName,
    this.flatId,
    this.flatNumber,
    this.role,
    this.deviceId,
  });
  
  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'] as String,
      phone: json['phone'] as String,
      name: json['name'] as String,
      avatarUrl: json['avatarUrl'] as String?,
      societyId: json['membership']?['societyId'] as String?,
      societyName: json['membership']?['society']?['name'] as String?,
      flatId: json['membership']?['flatId'] as String?,
      flatNumber: json['membership']?['flat']?['number'] as String?,
      role: json['membership']?['role'] as String?,
      deviceId: json['deviceId'] as String?,
    );
  }
  
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'phone': phone,
      'name': name,
      'avatarUrl': avatarUrl,
      'societyId': societyId,
      'societyName': societyName,
      'flatId': flatId,
      'flatNumber': flatNumber,
      'role': role,
      'deviceId': deviceId,
    };
  }
  
  User copyWith({
    String? id,
    String? phone,
    String? name,
    String? avatarUrl,
    String? societyId,
    String? societyName,
    String? flatId,
    String? flatNumber,
    String? role,
    String? deviceId,
  }) {
    return User(
      id: id ?? this.id,
      phone: phone ?? this.phone,
      name: name ?? this.name,
      avatarUrl: avatarUrl ?? this.avatarUrl,
      societyId: societyId ?? this.societyId,
      societyName: societyName ?? this.societyName,
      flatId: flatId ?? this.flatId,
      flatNumber: flatNumber ?? this.flatNumber,
      role: role ?? this.role,
      deviceId: deviceId ?? this.deviceId,
    );
  }
}