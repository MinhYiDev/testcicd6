const arrToObject = (arr) => {
    return Object.fromEntries(arr.map((a) => [a, 1]));
};

export default arrToObject;
