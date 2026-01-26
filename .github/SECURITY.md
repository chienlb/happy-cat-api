# Security Policy

## 🔒 Reporting a Vulnerability

Chúng tôi rất coi trọng bảo mật của Happy Cat API. Nếu bạn phát hiện một lỗ hổng bảo mật, vui lòng báo cáo một cách có trách nhiệm.

### ⚠️ KHÔNG làm gì sau đây:
- ❌ KHÔNG tạo public GitHub issue cho security vulnerabilities
- ❌ KHÔNG công khai thông tin về vulnerability trước khi được fix
- ❌ KHÔNG exploit vulnerability trên production systems

### ✅ Cách báo cáo đúng:

1. **Email trực tiếp:**
   - Email: security@happycat.com
   - Subject: [SECURITY] Brief description

2. **GitHub Security Advisory:**
   - Truy cập: https://github.com/OWNER/happy-cat-api/security/advisories/new
   - Điền form báo cáo

3. **Thông tin cần cung cấp:**
   - Mô tả chi tiết về vulnerability
   - Các bước để reproduce
   - Potential impact
   - Suggested fix (nếu có)
   - Your contact information

## 📋 Supported Versions

Chúng tôi cung cấp security updates cho các versions sau:

| Version | Supported          | End of Life |
| ------- | ------------------ | ----------- |
| 2.x.x   | ✅ Yes             | -           |
| 1.x.x   | ✅ Yes             | 2026-12-31  |
| < 1.0   | ❌ No              | 2025-01-01  |

## 🔍 Security Measures

### Current Security Implementations

- **Authentication:** JWT-based authentication
- **Authorization:** Role-based access control (RBAC)
- **Data Encryption:** 
  - TLS 1.3 for data in transit
  - AES-256 for sensitive data at rest
- **Input Validation:** 
  - DTO validation with class-validator
  - SQL injection prevention
  - XSS protection
- **Rate Limiting:** API rate limiting implemented
- **CORS:** Configured properly for production
- **Helmet:** Security headers configured
- **Dependencies:** Regular security audits

### Security Headers

```typescript
// Implemented headers
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Content-Security-Policy: default-src 'self'
```

## 🛡️ Security Best Practices

### For Contributors

1. **Never commit sensitive data:**
   - No API keys, tokens, passwords
   - No .env files
   - Use .env.example with placeholder values

2. **Use security scanning tools:**
   ```bash
   pnpm audit
   pnpm run security:check
   ```

3. **Follow secure coding practices:**
   - Always validate input
   - Use parameterized queries
   - Implement proper error handling
   - Don't expose stack traces in production

4. **Dependencies:**
   - Keep dependencies updated
   - Review dependency security advisories
   - Use `pnpm audit` regularly

### For Users/Deployers

1. **Environment Variables:**
   ```bash
   # Strong secrets
   JWT_SECRET=<strong-random-secret-min-32-chars>
   
   # Secure database credentials
   MONGODB_URI=mongodb://user:strong_password@host:port/db
   
   # Secure Redis
   REDIS_PASSWORD=<strong-password>
   ```

2. **Production Checklist:**
   - [ ] Change all default credentials
   - [ ] Use HTTPS only
   - [ ] Enable rate limiting
   - [ ] Configure CORS properly
   - [ ] Set up monitoring and alerts
   - [ ] Regular backups
   - [ ] Keep system updated

3. **Network Security:**
   - Use firewall rules
   - Restrict database access
   - Use private networks when possible
   - Enable VPN for administrative access

## 📝 Vulnerability Response Process

### Timeline

1. **Day 0:** Vulnerability reported
2. **Day 1-2:** Initial assessment and acknowledgment
3. **Day 3-7:** Investigation and fix development
4. **Day 7-14:** Testing and validation
5. **Day 14:** Security patch release
6. **Day 30:** Public disclosure (if appropriate)

### Communication

- Reporter will be kept informed throughout the process
- Security advisories will be published for critical issues
- Release notes will document security fixes

## 🏆 Security Hall of Fame

Chúng tôi ghi nhận và cảm ơn các researchers đã báo cáo vulnerabilities:

<!-- Will be updated with contributors -->

## 📞 Contact

- **Security Email:** security@happycat.com
- **PGP Key:** [Download](https://happycat.com/pgp-key.txt)
- **Response Time:** Within 48 hours

## 🔄 Updates

This security policy is reviewed and updated quarterly.

**Last Updated:** January 26, 2026
**Next Review:** April 26, 2026

## 📚 Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [NestJS Security](https://docs.nestjs.com/security/authentication)
- [MongoDB Security](https://docs.mongodb.com/manual/security/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)

---

Thank you for helping keep Happy Cat API secure! 🔒
