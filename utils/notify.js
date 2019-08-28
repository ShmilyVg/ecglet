export async function notifyCurrentPage({eventName, eventValue}) {
    const currentPages = getCurrentPages(), length = currentPages.length;
    if (currentPages && length) {
        const page = currentPages[length - 1], {observers} = page;
        if (observers) {
            const observer = observers[eventName];
            if (observer) {
                const currentResult = await observer.call(page, eventValue);

            }
        }
    }
}

export async function notifyAllPage({eventName, eventValue}) {
    const currentPages = getCurrentPages(), length = currentPages.length;
    if (currentPages && length) {
        for (let page of currentPages.reverse()) {
            const {observers} = page;
            if (observers) {
                const observer = observers[eventName];
                if (observer) {
                    const currentResult = await observer.call(page, eventValue);
                    if (currentResult && currentResult.deliver) {

                    }
                    console.error('接收到的结果', typeof currentResult);
                }
            }
        }
    }
}
