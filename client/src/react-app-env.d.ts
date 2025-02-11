/// <reference types="react" />
/// <reference types="react-dom" />

declare module '*.css' {
  const classes: { [key: string]: string };
  export default classes;
} 