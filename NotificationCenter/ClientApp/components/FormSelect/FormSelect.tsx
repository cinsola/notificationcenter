import * as React from "react";
export default class FormSelect extends React.Component<FormSelectProps, FormSelectState> {
    constructor(props: FormSelectProps) {
        super(props);
        this.state = {
            actualValue: props.initialValue,
            selectOptions: new Array<FormSelectOption>()
        };
    }

    componentDidMount() {
        this.props.optionsResolver().then(resolved => {
            this.setState({ selectOptions: resolved });
            if (this.props.initialValue == null) {
                this._componentValueChanged(this.state.selectOptions[0].key);
            }
        });
    }    

    public componentValueChanged(e: React.ChangeEvent<HTMLSelectElement>) {
        var groupId = Number(e.target.value);
        this._componentValueChanged(groupId);
    }

    private _componentValueChanged(e: number) {
        var groupId = e;
        this.setState({ actualValue: e });
        this.props.changeHandler(e);
    }

    public render() {
        return <div className="form-group">
            <label htmlFor={this.props.htmlTagFor}> {this.props.label}</label>
            <select value={String(this.state.actualValue)} onChange={(e) => this.componentValueChanged(e)} className="form-control" id={this.props.htmlTagFor} placeholder={this.props.placeholder}>
                {this.state.selectOptions.map(element => <option key={element.key} value={element.key}>{ element.value }</option>)}
            </select>
            {this.props.error != null && <p className="text-danger">{this.props.error}</p>}
        </div >
    }
}