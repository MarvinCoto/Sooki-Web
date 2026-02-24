import { Routes, Route } from 'react-router-dom';
import RegisterStoreScreen from './screens/RegisterStoreScreen';

function App() {
  return (
    <Routes>
      <Route path="/" element={<RegisterStoreScreen />} />
    </Routes>
  );
}

export default App;