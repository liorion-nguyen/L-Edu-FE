import React from "react";
import { Select, Space } from "antd";
import type { SelectProps } from "antd";

interface CustomSelectMultipleProps {
    options: SelectProps["options"];
    placeholder?: string;
    defaultValue?: string[];
    onChange?: (value: string[]) => void;
}

const CustomSelectMultiple: React.FC<CustomSelectMultipleProps> = ({
    options,
    placeholder = "Please select",
    defaultValue,
    onChange,
}) => {
    const handleChange = (value: string[]) => {
        if (onChange) {
            onChange(value);
        }
    };

    return (
        <Space style={{ width: "100%" }} direction="vertical">
            <Select
                mode="multiple"
                allowClear
                style={{ width: "100%" }}
                placeholder={placeholder}
                onChange={handleChange}
                defaultValue={defaultValue}
                options={options}
                filterOption={(input, option) =>
                    (option?.label as string)?.toLowerCase().includes(input.toLowerCase()) ||
                    (option?.value as string)?.toLowerCase().includes(input.toLowerCase())
                }
                showSearch
            />
        </Space>
    );
};

export default CustomSelectMultiple;