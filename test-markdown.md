# Test Markdown với Code Blocks

## Inline Code
Đây là `inline code` và `another inline code` trong câu.

## Code Block với language

```javascript
const obj = {
  name: "React Native",
  description: "Tổng hợp kiến thức khóa học",
  components: ["View", "Text", "TextInput"]
};

console.log(obj);
```

```bash
[object Object],
expo init projectName

,[object Object],
npm start
,[object Object],
```

```typescript
interface Component {
  name: string;
  description: string;
  example: string;
}

const components: Component[] = [
  {
    name: "View",
    description: "Container cơ bản, tương đương div trong HTML",
    example: "<View style={styles.container}>...</View>"
  }
];
```

## Object trong content
Một số trường hợp có thể xuất hiện object không được convert đúng cách.
