export default function RoundedButton({
    className = '',
    disabled,
    children,
    style: styleProp = {},
    ...props
}) {
    return (
        <button
            {...props}
            className={
                `inline-flex items-center rounded-3xl border border-transparent px-20 py-4 text-xs font-semibold uppercase tracking-widest transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    disabled ? 'opacity-40 cursor-not-allowed' : ''
                } ` + className
            }
            disabled={disabled}
            style={{
                background: "#5d4dff",
                color: "#ffffff",
                opacity: 1,
                ...styleProp,
            }}
        >
            {children}
        </button>
    );
}