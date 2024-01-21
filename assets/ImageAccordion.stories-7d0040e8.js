import{j as r,a as n}from"./jsx-runtime-37f7df21.js";import{I as a}from"./ScaledText-fc28508a.js";import"./index-f1f2c4b1.js";import"./extends-98964cd2.js";import"./index-1b872288.js";const m={title:"components/ImageAccordion",component:a},c={name:"ImageAccordion",render:()=>r(a,{type:"single",collapsible:!0,children:Array.from(Array(3).keys()).map(e=>n(a.Item,{value:`${e}`,src:`https://source.unsplash.com/random/500x500/?${e})`,className:"grayscale transition-all text-white font-bold",children:[r(a.Trigger,{className:"bg-black/50",children:n("div",{className:"grid w-full place-items-center p-2",children:["Accordion Item ",e+1]})}),r(a.Content,{children:r("div",{className:"grid p-2",children:r("h3",{className:"place-self-center grid w-fit min-w-40 place-items-center text-center bg-black/50 aspect-square rounded-full text-9xl",children:e+1})})})]},e))})};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  name: 'ImageAccordion',
  render: () => <ImageAccordion type='single' collapsible>\r
      {Array.from(Array(3).keys()).map(i => <ImageAccordion.Item value={\`\${i}\`} key={i} src={\`https://source.unsplash.com/random/500x500/?\${i})\`} className='grayscale transition-all text-white font-bold'>\r
          <ImageAccordion.Trigger className='bg-black/50'>\r
            <div className='grid w-full place-items-center p-2'>Accordion Item {i + 1}</div>\r
          </ImageAccordion.Trigger>\r
          <ImageAccordion.Content>\r
            <div className='grid p-2'>\r
              <h3 className='place-self-center grid w-fit min-w-40 place-items-center text-center bg-black/50 aspect-square rounded-full text-9xl'>\r
                {i + 1}\r
              </h3>\r
            </div>\r
          </ImageAccordion.Content>\r
        </ImageAccordion.Item>)}\r
    </ImageAccordion>
}`,...c.parameters?.docs?.source}}};const d=["Default"];export{c as Default,d as __namedExportsOrder,m as default};
