import {App} from './app';

const app = new App().exportApp();

let PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running in http://localhost:${PORT}`);
});

