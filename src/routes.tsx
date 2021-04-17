import React from 'react'; //A partir da versão 17 do react não é necessário importar react
import { BrowserRouter, Switch, Route } from 'react-router-dom'; 

import Landing from './pages/Landing';
import PointsMap from './pages/PointsMap';
import Point from './pages/Point';
import CreatePoint from './pages/CreatePoint';

function Routes() {
return (


<BrowserRouter>
<Switch>
<Route path="/" exact component={Landing} />
<Route path="/points" component={PointsMap} />

<Route path="/points/create" component={CreatePoint} />
<Route path="/points/:id" component={Point} />

</Switch>
</BrowserRouter>


);
}

export default Routes;