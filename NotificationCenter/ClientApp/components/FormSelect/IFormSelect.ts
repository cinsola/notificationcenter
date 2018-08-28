interface FormSelectProps {
    htmlTagFor: string;
    placeholder: string;
    initialValue: number | null;
    error: string | null;
    label: string;
    changeHandler: FormSelectDelegateChange;
    optionsResolver: FormSelectOptionDelegateResolver;
}

interface FormSelectOption {
    key: number;
    value: string;
}
interface FormSelectState {
    actualValue: number | null;
    selectOptions: Array<FormSelectOption>;
}

interface FormSelectDelegateChange {
    (changeHandler: number): void;
}

interface FormSelectOptionDelegateResolver {
    (): Promise<Array<FormSelectOption>>;
}