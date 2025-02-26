import MainLayout from './components/layouts/MainLayout/MainLayout';
import { useUser } from './hooks/useUser';

const App = () => {
  const user = useUser()
  console.log(user);
  return (
    <div>
    <MainLayout/>
    </div>
  );
};

export default App;