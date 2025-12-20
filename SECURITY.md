# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

**🚨 Please do NOT report security vulnerabilities through public GitHub issues.**

### How to Report

1. **Email:** Send details to [binitgupta.1711@gmail.com]
2. **Include:**
   - Type of vulnerability
   - Affected component (CLI, API, Web Dashboard, MCP)
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

### Response Timeline

- **Acknowledgment:** Within 48 hours
- **Initial Assessment:** Within 5 business days
- **Status Updates:** Every 7 days until resolved
- **Fix & Disclosure:** Coordinated disclosure after patch is released

### What Happens Next

1. We'll confirm receipt of your report
2. We'll investigate and validate the issue
3. We'll develop and test a fix
4. We'll release a security patch
5. We'll publicly disclose with credit to you (unless you prefer to remain anonymous)

## Security Best Practices

### For Users

- ✅ Keep `composter-cli` updated: `npm update -g composter-cli`
- ✅ Use strong passwords (min 12 characters)
- ✅ Never share your session token (`~/.config/composter/session.json`)
- ✅ Review component code before using in production
- ✅ Enable 2FA on your GitHub account

### For Self-Hosters

```bash
# Generate strong secrets
export BETTER_AUTH_SECRET=$(openssl rand -hex 32)

# Use secure database connections
DATABASE_URL="postgresql://user:password@localhost:5432/composter?sslmode=require"

# Enable HTTPS only
export NODE_ENV=production
```

### For Contributors

- ❌ Never commit `.env` files
- ❌ Never hardcode secrets in code
- ✅ Use environment variables for all sensitive data
- ✅ Run `npm audit` before submitting PRs
- ✅ Sanitize all user inputs
- ✅ Follow OWASP guidelines

## Known Security Considerations

- **Session Tokens:** Stored locally with 30-day expiry
- **Database Access:** User-scoped queries prevent cross-user access
- **CORS:** Configured for trusted origins only
- **Dependencies:** Regular audits with `npm audit`

## Bug Bounty

We don't currently offer a bug bounty program, but we deeply appreciate security researchers and will provide:
- Public acknowledgment (with your permission)
- Priority support for future issues
- Contributor credit in releases

Thank you for keeping Composter secure! 🔒