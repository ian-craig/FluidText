import * as React from "react";
import "./../assets/scss/App.scss";
import { Document } from "./Document";

const reactLogo = require("./../assets/img/react_logo.svg");

export interface AppProps {
}

export class App extends React.Component<AppProps, undefined> {
    render() {
        return (
            <div className="app">
                <Document />ss
                <img src={reactLogo} height="480"/>
            </div>
        );
    }
}
