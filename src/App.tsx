import React from 'react';

interface TitleProps {
  text: string;
}

function Title(props: TitleProps) {
return (
  <h1>{props.text}</h1>
)
}

function App() {
  return (

<div className="App">

  <Title text="título 1"/>
  <Title text="título 2"/>
  <Title text="título 3"/>
</div>

    );
}

export default App;
