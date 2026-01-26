# Contributing to Happy Cat API 🐱

Cảm ơn bạn đã quan tâm đến việc đóng góp cho Happy Cat API! Chúng tôi đánh giá cao mọi đóng góp từ cộng đồng.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [How to Contribute](#how-to-contribute)
- [Coding Standards](#coding-standards)
- [Commit Message Guidelines](#commit-message-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing Guidelines](#testing-guidelines)
- [Documentation](#documentation)

## 📜 Code of Conduct

Project này tuân theo [Code of Conduct](CODE_OF_CONDUCT.md). Bằng cách tham gia, bạn đồng ý tuân thủ các quy tắc này.

## 🚀 Getting Started

### Prerequisites

Đảm bảo bạn đã cài đặt:

- **Node.js** >= 18.x (khuyến nghị 20.x)
- **pnpm** >= 8.x
- **MongoDB** >= 7.x
- **Redis** >= 7.x
- **Git**

### Development Setup

1. **Fork repository**
   ```bash
   # Truy cập GitHub và fork repo
   ```

2. **Clone repository của bạn**
   ```bash
   git clone https://github.com/YOUR_USERNAME/happy-cat-api.git
   cd happy-cat-api
   ```

3. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/ORIGINAL_OWNER/happy-cat-api.git
   ```

4. **Install pnpm** (nếu chưa có)
   ```bash
   npm install -g pnpm
   ```

5. **Install dependencies**
   ```bash
   pnpm install
   ```

6. **Setup environment variables**
   ```bash
   cp .env.example .env
   # Sau đó chỉnh sửa .env với các giá trị phù hợp
   ```

7. **Start services** (MongoDB & Redis)
   ```bash
   # Sử dụng Docker
   docker-compose up -d mongodb redis
   
   # Hoặc start services locally
   ```

8. **Run development server**
   ```bash
   pnpm run start:dev
   ```

9. **Verify setup**
   ```bash
   curl http://localhost:3000/health
   ```

## 🤝 How to Contribute

### Reporting Bugs

1. Kiểm tra [existing issues](https://github.com/OWNER/happy-cat-api/issues) để đảm bảo bug chưa được báo cáo
2. Sử dụng [Bug Report template](.github/ISSUE_TEMPLATE/bug_report.md)
3. Cung cấp thông tin chi tiết:
   - Mô tả bug rõ ràng
   - Các bước tái hiện
   - Kết quả mong đợi vs thực tế
   - Screenshots (nếu có)
   - Môi trường (OS, Node version, etc.)

### Suggesting Features

1. Kiểm tra [existing feature requests](https://github.com/OWNER/happy-cat-api/issues?q=is%3Aissue+is%3Aopen+label%3Aenhancement)
2. Sử dụng [Feature Request template](.github/ISSUE_TEMPLATE/feature_request.md)
3. Giải thích rõ:
   - Vấn đề cần giải quyết
   - Giải pháp đề xuất
   - Các giải pháp thay thế đã xem xét

### Submitting Changes

1. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix-name
   ```

2. **Make your changes**
   - Follow [Coding Standards](#coding-standards)
   - Write tests
   - Update documentation

3. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add amazing feature"
   ```
   - Follow [Commit Message Guidelines](#commit-message-guidelines)

4. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Create Pull Request**
   - Sử dụng [PR template](.github/PULL_REQUEST_TEMPLATE.md)
   - Link đến related issues
   - Mô tả chi tiết changes

## 💻 Coding Standards

### TypeScript Style Guide

- **Sử dụng TypeScript strict mode**
- **Tránh sử dụng `any`** - Prefer proper typing
- **Use interface cho objects** thay vì type (trừ khi cần union types)
- **Use PascalCase** cho classes, interfaces, types
- **Use camelCase** cho variables, functions, methods
- **Use UPPER_SNAKE_CASE** cho constants

### NestJS Best Practices

```typescript
// ✅ Good
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly mailService: MailService,
  ) {}

  async findById(id: string): Promise<User> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}

// ❌ Bad
export class UsersService {
  private userModel: any;
  
  async findById(id: any) {
    return this.userModel.findById(id);
  }
}
```

### File Structure

```
src/app/modules/feature-name/
├── feature-name.module.ts
├── feature-name.controller.ts
├── feature-name.service.ts
├── dto/
│   ├── create-feature.dto.ts
│   └── update-feature.dto.ts
├── schema/
│   └── feature.schema.ts
└── interfaces/
    └── feature.interface.ts
```

### Naming Conventions

- **Files**: `kebab-case.suffix.ts`
  - Controllers: `users.controller.ts`
  - Services: `users.service.ts`
  - Modules: `users.module.ts`
  - DTOs: `create-user.dto.ts`
  - Schemas: `user.schema.ts`

- **Classes**: `PascalCase`
  - `UsersController`
  - `UsersService`
  - `CreateUserDto`

- **Methods**: `camelCase`
  - `findUserById()`
  - `createUser()`
  - `updateUserProfile()`

### Code Quality

```bash
# Run linter
pnpm run lint

# Fix linting issues
pnpm run lint:fix

# Format code
pnpm run format

# Type check
pnpm run build
```

### Error Handling

```typescript
// ✅ Good - Use NestJS built-in exceptions
async findUser(id: string): Promise<User> {
  const user = await this.userModel.findById(id);
  if (!user) {
    throw new NotFoundException(`User with ID ${id} not found`);
  }
  return user;
}

// ❌ Bad - Generic errors
async findUser(id: string) {
  try {
    return await this.userModel.findById(id);
  } catch (error) {
    throw new Error('Something went wrong');
  }
}
```

## 📝 Commit Message Guidelines

Chúng tôi sử dụng [Conventional Commits](https://www.conventionalcommits.org/).

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: Tính năng mới
- **fix**: Sửa bug
- **docs**: Thay đổi documentation
- **style**: Formatting, missing semicolons, etc.
- **refactor**: Code refactoring
- **perf**: Performance improvements
- **test**: Thêm hoặc sửa tests
- **chore**: Maintenance tasks
- **ci**: CI/CD changes
- **build**: Build system changes

### Examples

```bash
# Feature
feat(users): add email verification

# Bug fix
fix(auth): resolve token expiration issue

# Documentation
docs(readme): update installation instructions

# Refactoring
refactor(groups): simplify member validation logic

# Breaking change
feat(api)!: change response format for all endpoints

BREAKING CHANGE: All API responses now follow new format
```

### Scope

Sử dụng module name: `users`, `auth`, `groups`, `lessons`, etc.

### Rules

- Sử dụng imperative mood: "add" not "added"
- Không viết hoa chữ cái đầu
- Không có dấu chấm ở cuối
- Giới hạn subject line ở 72 ký tự
- Reference issues và PRs trong footer

## 🔄 Pull Request Process

### Before Submitting

1. **Update your branch**
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Run all checks**
   ```bash
   pnpm run lint
   pnpm run format
   pnpm run test
   pnpm run test:e2e
   pnpm run build
   ```

3. **Update documentation**
   - README.md (nếu cần)
   - API docs
   - Code comments

4. **Self-review**
   - Review your own code
   - Remove debug code, console.logs
   - Check for typos

### PR Checklist

- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] Tests added/updated
- [ ] All tests pass
- [ ] No new warnings
- [ ] Breaking changes documented

### Review Process

1. **Automated checks** sẽ chạy (CI/CD)
2. **Reviewers** sẽ được assign
3. **Address feedback** nếu có
4. **Approval** từ ít nhất 1 maintainer
5. **Merge** khi tất cả checks pass

### After Merge

- Delete your branch
- Update your local repository
- Thank reviewers! 😊

## 🧪 Testing Guidelines

### Unit Tests

```typescript
// users.service.spec.ts
describe('UsersService', () => {
  let service: UsersService;
  let model: Model<UserDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    model = module.get<Model<UserDocument>>(getModelToken(User.name));
  });

  it('should find user by id', async () => {
    const mockUser = { _id: '123', email: 'test@example.com' };
    jest.spyOn(model, 'findById').mockResolvedValue(mockUser);

    const result = await service.findById('123');
    
    expect(result).toEqual(mockUser);
    expect(model.findById).toHaveBeenCalledWith('123');
  });
});
```

### E2E Tests

```typescript
// users.e2e-spec.ts
describe('UsersController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/users (GET)', () => {
    return request(app.getHttpServer())
      .get('/users')
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('data');
        expect(Array.isArray(res.body.data)).toBe(true);
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
```

### Running Tests

```bash
# Unit tests
pnpm run test

# E2E tests
pnpm run test:e2e

# Test coverage
pnpm run test:cov

# Watch mode
pnpm run test:watch
```

### Test Coverage

- Aim for **>80%** coverage
- All new features must have tests
- Bug fixes should include regression tests

## 📚 Documentation

### Code Comments

```typescript
/**
 * Find a user by their ID
 * @param id - The user's unique identifier
 * @returns Promise containing the user document
 * @throws NotFoundException if user doesn't exist
 */
async findUserById(id: string): Promise<UserDocument> {
  // Implementation
}
```

### API Documentation

- Update Swagger/OpenAPI decorators
- Update Postman collection
- Add examples for new endpoints

### README Updates

Update README.md nếu có:
- New features
- Changed dependencies
- New environment variables
- Installation steps

## 🎯 Issue Labels

- `bug` - Bug reports
- `enhancement` - Feature requests
- `documentation` - Documentation improvements
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention needed
- `priority: high` - High priority
- `priority: low` - Low priority
- `status: in progress` - Currently being worked on
- `status: review` - Ready for review

## 💡 Tips for Success

1. **Start small** - Begin with small contributions
2. **Ask questions** - Don't hesitate to ask if unclear
3. **Be patient** - Reviews may take time
4. **Be respectful** - Treat others with respect
5. **Have fun!** - Enjoy contributing! 🎉

## 📞 Getting Help

- **Discord**: [Join our server](#)
- **GitHub Discussions**: [Ask questions](https://github.com/OWNER/happy-cat-api/discussions)
- **Email**: support@happycat.com

## 🙏 Thank You!

Cảm ơn bạn đã đóng góp vào Happy Cat API! Mỗi contribution, dù lớn hay nhỏ, đều giúp project tốt hơn.

---

**Happy Coding! 🐱💻**
