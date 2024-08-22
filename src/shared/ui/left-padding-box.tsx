interface Props {
	children: React.ReactNode;
}

const TAB_WIDTH = "16px";

export const LeftPaddingBox = ({ children }: Props) => {
	return <div style={{ paddingLeft: TAB_WIDTH }}>{children}</div>;
};
