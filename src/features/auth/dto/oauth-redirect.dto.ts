import { ApiProperty } from "@nestjs/swagger";

export class OAuthRedirectDto {
  @ApiProperty({
    description: "第三方授权地址",
    example:
      "https://github.com/login/oauth/authorize?client_id=your-client-id&state=018f10a7-4a6d-7f69-8e1b-123456789abc",
  })
  url: string;

  @ApiProperty({
    description: "CSRF 状态码，回调时需原样带回",
    format: "uuid",
    example: "018f10a7-4a6d-7f69-8e1b-123456789abc",
  })
  state: string;
}
