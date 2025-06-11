# Contributing to CSDeepSeek

Thank you for your interest in contributing to CSDeepSeek! This document provides guidelines and instructions for contributing.

## Development Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/your-username/csdeepseek.git
   cd csdeepseek/backend
   ```
3. Install dependencies:
   ```bash
   make deps
   ```
4. Install development tools:
   ```bash
   make tools
   ```

## Development Workflow

1. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes

3. Run tests:
   ```bash
   make test
   ```

4. Run linter:
   ```bash
   make lint
   ```

5. Format code:
   ```bash
   make fmt
   ```

6. Commit your changes:
   ```bash
   git commit -m "feat: your feature description"
   ```

7. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

8. Create a Pull Request

## Code Style

- Follow Go best practices
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused
- Write tests for new features
- Update documentation as needed

## Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation changes
- `style:` for formatting changes
- `refactor:` for code refactoring
- `test:` for test changes
- `chore:` for maintenance tasks

## Pull Request Process

1. Update documentation
2. Add tests for new features
3. Ensure all tests pass
4. Update the README if needed
5. Follow the PR template
6. Request review from maintainers

## Questions?

Feel free to open an issue for any questions or concerns. 