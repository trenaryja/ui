import{j as t}from"./jsx-runtime-37f7df21.js";import{A as s}from"./ScaledText-fc28508a.js";import"./index-f1f2c4b1.js";import"./extends-98964cd2.js";import"./index-1b872288.js";const g={title:"components/AsciiImage",component:s,argTypes:{characterRamp:{control:"text"}}},o=await fetch("https://source.unsplash.com/random/500x500/?face").then(a=>a.url),r={render:a=>t(s,{...a}),args:{src:o}},e={...r,args:{...r.args,showImage:!0,preClassName:"bg-clip-text text-transparent"}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  render: args => <AsciiImage {...args} />,
  args: {
    src
  }
}`,...r.parameters?.docs?.source}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  ...Default,
  args: {
    ...Default.args,
    showImage: true,
    preClassName: 'bg-clip-text text-transparent'
  }
}`,...e.parameters?.docs?.source}}};const u=["Default","BackgroundClip"];export{e as BackgroundClip,r as Default,u as __namedExportsOrder,g as default};
