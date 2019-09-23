import { Button } from "antd";
import { Buttons, ButtonsGroup } from "./styles/button.style";
import WithDirection from "./utils/withDirection";

const AntButton = Buttons(Button);
const MtButton = WithDirection(AntButton);
const AntButtonGroup = ButtonsGroup(Button.Group);
const ButtonGroup = WithDirection(AntButtonGroup);

export default MtButton;
export { ButtonGroup };
