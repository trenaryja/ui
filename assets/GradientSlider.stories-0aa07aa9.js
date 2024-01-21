import{a as d,j as e}from"./jsx-runtime-37f7df21.js";import{G as n,c as s,H as S}from"./ScaledText-fc28508a.js";import{R as l}from"./index-f1f2c4b1.js";import"./extends-98964cd2.js";import"./index-1b872288.js";const A={title:"components/GradientSlider",component:n},g={gradient:["red","green","blue"]},i={argTypes:{onChange:{table:{disable:!0}}},args:g},c={name:"Controlled vs Uncontrolled",render:()=>{const[r,m]=l.useState(50);return d("div",{className:"grid gap-10",children:[e("h1",{children:"Uncontrolled"}),e(n,{...g}),e("h1",{children:"Controlled"}),e(n,{...g,value:r,onChange:t=>m(t)}),e("h1",{children:"Controlled & Locked"}),e(n,{...g,value:r})]})}},u={render:()=>{const[r,m]=l.useState(0),[t,C]=l.useState(1),[h,v]=l.useState(.5),[x,f]=l.useState(1),p=s(r,t,h,"hsl").alpha(x),o=p.hex("rgb");return d("div",{className:"flex gap-10",children:[d("div",{className:"flex flex-col gap-5 w-full justify-between",children:[e(S,{thumbColor:o,value:r,onChange:a=>m(a)}),e(n,{thumbColor:o,gradient:[s(r,0,h,"hsl"),s(r,1,h,"hsl")],value:t*100,onChange:a=>C(a/100)}),e(n,{thumbColor:o,gradient:[s(r,t,0,"hsl"),s(r,t,.5,"hsl"),s(r,t,1,"hsl")],value:h*100,onChange:a=>v(a/100)}),e(n,{thumbColor:o,gradient:["#0000",o],value:x*100,onChange:a=>f(a/100)})]}),d("div",{className:"flex flex-col w-40 items-center",children:[e("svg",{viewBox:"0 0 1 1",children:e("rect",{width:1,height:1,fill:p.hex()})}),e("p",{className:"font-extrabold text-lg",children:p.hex()})]})]})}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  argTypes: {
    onChange: {
      table: {
        disable: true
      }
    }
  },
  args: defaultArgs
}`,...i.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  name: 'Controlled vs Uncontrolled',
  render: () => {
    const [hue, setHue] = React.useState(50);
    return <div className='grid gap-10'>\r
        <h1>Uncontrolled</h1>\r
        <GradientSlider {...defaultArgs} />\r
        <h1>Controlled</h1>\r
        <GradientSlider {...defaultArgs} value={hue} onChange={x => setHue(x)} />\r
        <h1>Controlled & Locked</h1>\r
        <GradientSlider {...defaultArgs} value={hue} />\r
      </div>;
  }
}`,...c.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [hue, setHue] = React.useState(0);
    const [saturation, setSaturation] = React.useState(1);
    const [lightness, setLightness] = React.useState(0.5);
    const [alpha, setAlpha] = React.useState(1);
    const color = chroma(hue, saturation, lightness, 'hsl').alpha(alpha);
    const thumbColor = color.hex('rgb');
    return <div className='flex gap-10'>\r
        <div className='flex flex-col gap-5 w-full justify-between'>\r
          <HueSlider thumbColor={thumbColor} value={hue} onChange={x => setHue(x)} />\r
          <GradientSlider thumbColor={thumbColor} gradient={[chroma(hue, 0, lightness, 'hsl'), chroma(hue, 1, lightness, 'hsl')]} value={saturation * 100} onChange={x => setSaturation(x / 100)} />\r
          <GradientSlider thumbColor={thumbColor} gradient={[chroma(hue, saturation, 0, 'hsl'), chroma(hue, saturation, 0.5, 'hsl'), chroma(hue, saturation, 1, 'hsl')]} value={lightness * 100} onChange={x => setLightness(x / 100)} />\r
          <GradientSlider thumbColor={thumbColor} gradient={['#0000', thumbColor]} value={alpha * 100} onChange={x => setAlpha(x / 100)} />\r
        </div>\r
        <div className='flex flex-col w-40 items-center'>\r
          <svg viewBox='0 0 1 1'>\r
            <rect width={1} height={1} fill={color.hex()} />\r
          </svg>\r
          <p className='font-extrabold text-lg'>{color.hex()}</p>\r
        </div>\r
      </div>;
  }
}`,...u.parameters?.docs?.source}}};const R=["Default","Controlled","ColorPicker"];export{u as ColorPicker,c as Controlled,i as Default,R as __namedExportsOrder,A as default};
