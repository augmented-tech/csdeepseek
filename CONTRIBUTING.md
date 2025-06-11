# Contributing to CSDeepSeek

Thank you for your interest in contributing to CSDeepSeek! This document provides guidelines and information for contributors.

## 🤝 How to Contribute

### Reporting Issues

1. **Search existing issues** first to avoid duplicates
2. **Use issue templates** when available
3. **Provide detailed information**:
   - Clear description of the problem
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Environment details (OS, WeChat version, Go version)

### Suggesting Features

1. **Check existing feature requests** to avoid duplicates
2. **Provide clear use cases** and benefits
3. **Consider the scope** - features should align with project goals
4. **Be open to discussion** and alternative solutions

### Code Contributions

#### Prerequisites
- Go 1.21 or later
- WeChat Developer Tools
- Git knowledge
- Familiarity with WeChat Mini Program development

#### Development Setup

1. **Fork the repository**
   ```bash
   git clone https://github.com/yourusername/csdeepseek.git
   cd csdeepseek
   ```

2. **Set up the backend**
   ```bash
   cd csdeepseek/backend
   go mod tidy
   cp env.example .env
   # Edit .env with your DeepSeek API key
   ```

3. **Set up the frontend**
   - Open `csdeepseek/frontend` in WeChat Developer Tools
   - Configure API endpoint in `services/api/api.js`

#### Making Changes

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Follow coding standards**
   - **Go**: Follow [Effective Go](https://golang.org/doc/effective_go.html) guidelines
   - **WeChat Mini Program**: Follow [WeChat development guidelines](https://developers.weixin.qq.com/miniprogram/dev/)
   - Use meaningful variable and function names
   - Add comments for complex logic
   - Keep functions small and focused

3. **Write tests**
   ```bash
   # Backend tests
   cd csdeepseek/backend
   go test ./...
   
   # Frontend testing
   # Test thoroughly in WeChat Developer Tools
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add amazing new feature"
   ```

   **Commit Message Format:**
   - `feat:` new features
   - `fix:` bug fixes
   - `docs:` documentation changes
   - `style:` code style changes
   - `refactor:` code refactoring
   - `test:` adding or updating tests
   - `chore:` maintenance tasks

5. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   ```
   Then create a Pull Request on GitHub.

## 📋 Code Standards

### Go Backend

- **Formatting**: Use `go fmt`
- **Linting**: Use `golangci-lint`
- **Testing**: Aim for good test coverage
- **Error Handling**: Always handle errors appropriately
- **Documentation**: Add godoc comments for exported functions

Example:
```go
// GenerateResponse creates an AI response for the given messages.
// It returns the response text or an error if the generation fails.
func (s *Service) GenerateResponse(ctx context.Context, messages []Message) (string, error) {
    if len(messages) == 0 {
        return "", fmt.Errorf("no messages provided")
    }
    // ... implementation
}
```

### WeChat Frontend

- **File Structure**: Follow the established directory structure
- **Naming**: Use descriptive names for components and functions
- **WXSS**: Follow WeChat styling guidelines
- **Performance**: Optimize for mobile devices
- **Accessibility**: Consider different screen sizes and user needs

Example:
```javascript
// services/api/api.js
const sendMessage = async (sessionId, message) => {
  try {
    const response = await wx.request({
      url: `${BASE_URL}/chat`,
      method: 'POST',
      data: { session_id: sessionId, message }
    });
    return response.data;
  } catch (error) {
    console.error('Failed to send message:', error);
    throw error;
  }
};
```

## 🧪 Testing Guidelines

### Backend Testing

```bash
# Run all tests
go test ./...

# Run with coverage
go test -cover ./...

# Run specific test
go test ./services/llm -v
```

### Frontend Testing

- Test in WeChat Developer Tools simulator
- Test on real devices when possible
- Test different screen sizes
- Test network conditions (offline/slow)
- Verify all user interactions work correctly

## 📝 Documentation

- Update README.md if you add new features
- Add inline comments for complex logic
- Update API documentation for backend changes
- Include examples in your documentation

## 🔍 Review Process

1. **Automated checks** must pass (if set up)
2. **Manual review** by maintainers
3. **Testing** on different environments
4. **Discussion** and feedback incorporation
5. **Approval** and merge

## 🎯 Project Goals

When contributing, keep these goals in mind:

- **Educational Value**: Code should be easy to understand and learn from
- **Production Quality**: Maintain high standards for reliability and performance
- **Chinese Market**: Consider Chinese users and WeChat ecosystem
- **Best Practices**: Follow industry standards and modern patterns
- **Maintainability**: Write code that's easy to maintain and extend

## 🚫 What NOT to Contribute

- Breaking changes without discussion
- Code that doesn't follow project standards
- Features that don't align with project goals
- Proprietary or licensed code without permission
- Large refactors without prior discussion

## 💬 Getting Help

- **GitHub Issues**: For bugs and feature requests
- **GitHub Discussions**: For questions and general discussion
- **Code Comments**: For implementation-specific questions

## 🏆 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes for significant contributions
- GitHub contributor graphs

Thank you for helping make CSDeepSeek better! 🚀 