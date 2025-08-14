const Loading = ({ height = "100vh" }) => {
    return (
        <div
            style={{ height }}
            className="flex h-screen items-center justify-center"
        >
            <div className="size-10 rounded-full border-3 border-purple-500 border-t-transparent animate-spin" />
        </div>
    );
};

export default Loading;
