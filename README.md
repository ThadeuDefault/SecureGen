# SecureGen - Enhanced Password and UUID Generator

A modern and enhanced version of the password and UUID generator with an elegant design and advanced functionalities.

## 🚀 Features

### Functionalities
- **Smart Password Generator**:
  - Length control (4-128 characters)
  - Customizable options (uppercase, lowercase, numbers, symbols)
  - Visual password strength indicator
  - Guarantees at least one character of each selected type

- **UUID v4 Generator**:
  - Unique and valid UUIDs
  - Standard RFC 4122 format

## ⌨️ Keyboard Shortcuts

- `Ctrl/Cmd + R`: Regenerate password
- `Ctrl/Cmd + U`: Regenerate UUID
- `Ctrl/Cmd + C`: Copy (when field is focused)
- `↑/↓`: Adjust password length (when length field is focused)

## 🔒 Security

- All passwords and UUIDs are generated locally in the browser
- No data is sent to external servers
- Uses JavaScript `Math.random()` (suitable for general use, not cryptographic)
- For critical production use, consider using `crypto.getRandomValues()`

## 🎨 Technologies Used

- **HTML5**;
- **CSS3**;
- **JavaScript ES6+**;
- **FontAwesome 6**;
- **Google Fonts**;

## 📄 License

This project is an enhanced version of the original generator. Free for personal and commercial use.
