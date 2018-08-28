interface FormInputProps {
    htmlTagFor: string;
    placeholder: string;
    initialValue: string;
    error: string | null;
    label: string;
    isLong?: boolean;
    changeHandler: FormInputDelegateChange;
}

interface FormInputState {
    actualValue: string;
}

interface FormInputDelegateChange {
    (changeHandler: React.ChangeEvent<HTMLInputElement>): void;
}