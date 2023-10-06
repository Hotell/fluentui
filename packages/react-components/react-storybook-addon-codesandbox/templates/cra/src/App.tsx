import { FluentProvider, webLightTheme } from '@fluentui/react-components';
import { Example } from './example';

function App() {
  return (
    <FluentProvider theme={webLightTheme}>
      <Example />
    </FluentProvider>
  );
}

export default App;
