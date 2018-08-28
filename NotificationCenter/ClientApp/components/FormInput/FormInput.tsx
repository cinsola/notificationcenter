import * as React from "react";
export default class FormInput extends React.Component<FormInputProps, FormInputState> {
    constructor(props: FormInputProps | undefined) {
        super(props);
        if (props != undefined) {
            this.state = { actualValue: props.initialValue };
        }
    }

    public componentValueChanged(e: any) {
        this.props.changeHandler(e);
        this.setState({ actualValue: e.target.value });
    }

    public render() {
        return <div className="form-group">
            <label htmlFor={this.props.htmlTagFor}> {this.props.label}</label>
            {this.props.isLong != true && <input onChange={(e) => this.componentValueChanged(e)} value={this.props.initialValue}
                type="text" className="form-control" id={this.props.htmlTagFor} placeholder={this.props.placeholder} />}
            {this.props.isLong == true && <textarea onChange={(e) => this.componentValueChanged(e)} value={this.props.initialValue}
                className="form-control" id={this.props.htmlTagFor} placeholder={this.props.placeholder} />}
            {this.props.error != null && <p className="text-danger">{this.props.error}</p>}
        </div>
    }
}