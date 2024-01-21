import{a as n,j as e}from"./jsx-runtime-37f7df21.js";import{R as l}from"./index-f1f2c4b1.js";import{a as t}from"./ScaledText-fc28508a.js";import"./extends-98964cd2.js";import"./index-1b872288.js";const m={title:"components/ConditionalWrapper",component:t},r={name:"ConditionalWrapper",render:()=>{const[a,c]=l.useState(!1);return n("div",{className:"grid gap-10",children:[n("div",{className:"flex items-center gap-2",children:[e("input",{type:"checkbox",id:"checkbox",checked:a,onChange:()=>c(!a)}),e("label",{htmlFor:"checkbox",children:"Apply Wrapper"})]}),e(t,{condition:a,wrapper:i=>e("div",{className:"p-10 w-fit rounded-full bg-[repeating-radial-gradient(circle_at_50%_50%,_transparent_0,_black_1rem)]",children:e("h1",{className:"grayscale text-center text-5xl p-10 bg-black bg-opacity-50 rounded-full whitespace-nowrap",children:i})}),children:"Hello World 👋🌎"})]})}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  name: 'ConditionalWrapper',
  render: () => {
    const [isChecked, setIsChecked] = React.useState(false);
    return <div className='grid gap-10'>\r
        <div className='flex items-center gap-2'>\r
          <input type='checkbox' id='checkbox' checked={isChecked} onChange={() => setIsChecked(!isChecked)} />\r
          <label htmlFor='checkbox'>Apply Wrapper</label>\r
        </div>\r
        <ConditionalWrapper condition={isChecked} wrapper={children => <div className='p-10 w-fit rounded-full bg-[repeating-radial-gradient(circle_at_50%_50%,_transparent_0,_black_1rem)]'>\r
              <h1 className='grayscale text-center text-5xl p-10 bg-black bg-opacity-50 rounded-full whitespace-nowrap'>\r
                {children}\r
              </h1>\r
            </div>}>\r
          Hello World 👋🌎\r
        </ConditionalWrapper>\r
      </div>;
  }
}`,...r.parameters?.docs?.source}}};const u=["Default"];export{r as Default,u as __namedExportsOrder,m as default};
