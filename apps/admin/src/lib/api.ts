import { OpenAPI } from '@gatelite/api-client';

const API_BASE_URL = import.meta.env['VITE_API_URL'] || 'http://localhost:4000';

OpenAPI.BASE = `${API_BASE_URL}/v1`;
OpenAPI.WITH_CREDENTIALS = true;
OpenAPI.CREDENTIALS = 'include';

export { OpenAPI };