export interface JwtPayloadI {
  id: string | number;
  sub?: string | number;
  organization?: number;
  fullName?: string;
  iat?: number;
  exp?: number;
}
