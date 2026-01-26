## 📋 Description
<!-- Mô tả chi tiết về những thay đổi của bạn. Giải thích lý do và cách giải quyết vấn đề. -->



## 🏷️ Type of Change
<!-- Đánh dấu [x] vào TẤT CẢ các mục phù hợp -->

- [ ] 🐛 Bug fix (thay đổi không breaking mà sửa một vấn đề)
- [ ] ✨ New feature (thay đổi không breaking mà thêm chức năng mới)
- [ ] 💥 Breaking change (sửa lỗi hoặc tính năng gây ra thay đổi breaking cho API hiện có)
- [ ] 📝 Documentation update (cập nhật tài liệu)
- [ ] ⚡ Performance improvement (cải thiện hiệu suất)
- [ ] ♻️ Code refactoring (tái cấu trúc code không thay đổi chức năng)
- [ ] 🎨 UI/UX changes (thay đổi giao diện người dùng)
- [ ] 🔧 Configuration changes (thay đổi cấu hình)
- [ ] 🧪 Test updates (thêm hoặc cập nhật tests)
- [ ] 🔒 Security fix (sửa lỗi bảo mật)

## 🔗 Related Issues
<!-- Link đến các issues liên quan. Sử dụng từ khóa để tự động đóng issue -->
<!-- Ví dụ: Closes #123, Fixes #456, Resolves #789 -->

Closes #

## 📝 Changes Made
<!-- Liệt kê TẤT CẢ các thay đổi quan trọng với mô tả chi tiết -->

### Added
- 

### Changed
- 

### Removed
- 

### Fixed
- 

## 🧪 Testing Checklist
<!-- Đánh dấu [x] vào tất cả các mục đã hoàn thành -->

### Automated Tests
- [ ] All existing unit tests pass (`pnpm test`)
- [ ] All existing E2E tests pass (`pnpm run test:e2e`)
- [ ] New unit tests added for new features
- [ ] New E2E tests added for new features
- [ ] Test coverage maintained or improved (check with `pnpm run test:cov`)

### Manual Testing
- [ ] Tested locally in development environment
- [ ] Tested with different user roles (if applicable)
- [ ] Tested edge cases and error scenarios
- [ ] Tested on different environments (if applicable)

### API Testing
- [ ] API endpoints tested with Postman/Thunder Client
- [ ] Request/Response validation checked
- [ ] Error responses verified
- [ ] Authentication/Authorization tested (if applicable)

### Database
- [ ] Database migrations tested (if applicable)
- [ ] Data integrity verified
- [ ] Rollback tested (if applicable)

## 📸 Screenshots / Videos
<!-- Thêm screenshots hoặc video demo nếu có thay đổi UI hoặc chức năng quan trọng -->
<!-- Có thể kéo thả ảnh/video trực tiếp vào đây -->



## 🚀 Deployment Notes
<!-- Ghi chú quan trọng cho việc deploy -->

- [ ] Requires environment variable changes (list below)
- [ ] Requires database migration
- [ ] Requires external service configuration
- [ ] Has breaking changes (document below)
- [ ] Needs deployment order/steps (document below)

### Environment Variables Changes
<!-- Liệt kê các biến môi trường cần thêm/thay đổi -->
```bash
# Example:
# NEW_API_KEY=your-key-here
```

### Migration Steps
<!-- Nếu cần migration hoặc các bước đặc biệt khi deploy -->
```bash
# Example:
# pnpm run migration:up
```

### Breaking Changes
<!-- Mô tả chi tiết các breaking changes và cách migrate -->



## 📚 Documentation
<!-- Đánh dấu [x] nếu đã cập nhật tài liệu tương ứng -->

- [ ] README.md updated (if needed)
- [ ] API documentation updated (if API changes)
- [ ] Code comments added for complex logic
- [ ] JSDoc/TSDoc comments added
- [ ] Postman collection updated (if API changes)
- [ ] Architecture diagrams updated (if structural changes)

## 🔍 Code Quality Checklist
<!-- Đảm bảo code quality trước khi submit PR -->

### Code Standards
- [ ] Code follows project's TypeScript style guidelines
- [ ] ESLint passes without errors (`pnpm run lint`)
- [ ] Code is properly formatted (`pnpm run format`)
- [ ] No console.log or debug code left
- [ ] No commented-out code blocks
- [ ] Proper error handling implemented
- [ ] Input validation added where needed

### Best Practices
- [ ] Functions are small and focused (single responsibility)
- [ ] Appropriate use of async/await
- [ ] Proper use of TypeScript types (no `any` unless necessary)
- [ ] Dependencies injected properly (NestJS DI)
- [ ] Database queries optimized
- [ ] No N+1 query problems
- [ ] Proper use of caching (if applicable)

### Security
- [ ] No sensitive data in code or logs
- [ ] Input sanitization implemented
- [ ] SQL injection prevention checked
- [ ] XSS prevention checked
- [ ] Authentication/Authorization properly implemented
- [ ] Rate limiting considered (if applicable)

## 🔄 Review Checklist
<!-- Checklist cho người review -->

### For Reviewer
- [ ] Code logic is correct and makes sense
- [ ] Code is readable and maintainable
- [ ] Tests are comprehensive and meaningful
- [ ] No obvious performance issues
- [ ] Security considerations addressed
- [ ] Error handling is appropriate
- [ ] Documentation is clear and complete

## 💬 Additional Notes
<!-- Bất kỳ thông tin bổ sung nào mà reviewer cần biết -->
<!-- Có thể bao gồm: quyết định thiết kế, trade-offs, future improvements, etc. -->



## ✅ Pre-Submission Checklist
<!-- Đánh dấu [x] tất cả trước khi submit PR -->

- [ ] I have performed a self-review of my own code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings or errors
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes
- [ ] Any dependent changes have been merged and published
- [ ] I have checked my code and corrected any misspellings
- [ ] I have updated the CHANGELOG.md (if applicable)
- [ ] I have assigned reviewers
- [ ] I have added appropriate labels to this PR

---

<!-- 
Thank you for contributing to Happy Cat API! 🐱
Your PR will be reviewed as soon as possible.
-->

**Priority Level:** <!-- Low / Medium / High / Critical -->

**Estimated Review Time:** <!-- Quick (< 30 min) / Medium (1-2 hours) / Long (> 2 hours) -->
