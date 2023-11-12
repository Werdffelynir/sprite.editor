import './assets/gridcss.css'
import './assets/main.css'
import MainComponent from "./components/MainComponent";

async function main() {
    const state = {
        elements: {
            root: document.querySelector('#root'),
        },
    };
    const component = new MainComponent(state);
    component.render();
    window.component = component;
    return component
}

main().then(repository => {})
