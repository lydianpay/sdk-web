declare module '*.css?inline' {
  const content: string;
  export default content;
}
declare module '*.css' {
  const content: string;
  export default content;
}
declare module '*.html?raw' {
  const content: string;
  export default content;
}
