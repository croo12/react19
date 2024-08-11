const CardStyle: React.CSSProperties = {
	padding: "1rem"
};

interface Props {
	children: React.ReactNode;
	style?: React.CSSProperties;
}

export const Card = ({ children, style = CardStyle }: Props) => {
	return <div style={style}>{children}</div>;
};
