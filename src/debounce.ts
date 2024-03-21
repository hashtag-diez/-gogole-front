const debounce = (callback: (args: any) => void, delay: number = 1000) => {
    let timoutId: ReturnType<typeof setTimeout>;
    return function (this: any, event: Event){
        clearTimeout(timoutId);
        timoutId = setTimeout(() => callback.call(this,event), delay);
    }
}

const input = document.querySelector('input[type="search"]');
input?.addEventListener('input', debounce((event: Event) => {
    const target = event.target as HTMLInputElement
    console.log(target.value);
}))