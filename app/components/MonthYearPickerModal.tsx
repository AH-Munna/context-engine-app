import React from 'react';
import KeyboardBottomSheet from './ui/KeyboardBottomSheet';
import MonthYearPickerView, {
  MonthYearPickerViewProps,
} from './MonthYearPickerView';

export type MonthYearPickerModalProps = MonthYearPickerViewProps & {
  visible: boolean;
};

const MonthYearPickerModal: React.FC<MonthYearPickerModalProps> = ({
  visible,
  onCancel,
  ...pickerProps
}) => {
  return (
    <KeyboardBottomSheet
      visible={visible}
      onClose={onCancel ?? (() => {})}
      title="Select Month & Year"
      subtitle="Choose month and year"
      chromeHeight={120}
      fillHeight={false}
      scrollable={false}
      bodyContentStyle={{paddingHorizontal: 0}}>
      <MonthYearPickerView
        {...pickerProps}
        onCancel={onCancel}
        showCancelButton={pickerProps.showCancelButton ?? true}
      />
    </KeyboardBottomSheet>
  );
};

export default MonthYearPickerModal;
