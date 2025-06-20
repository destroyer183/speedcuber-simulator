
/** interface for simple queue */
interface IQueue<T> {
    enqueue(item: T): void;
    dequeue(): T | undefined;
    size(): number;
}

/**
 * A simple queue.
 * @implements 'IQueue'.
 */
export class Queue<T> implements IQueue<T> {

    /** main storage for the queue. */
    private storage: T[] = [];

    /** 
     * @constructor class constuctor for the queue 
     */
    constructor(
        /** optional argument for the capacity of the queue. default is infinity. */
        private capacity: number = Infinity
    ) {}

    /**
     * Function to add to the queue.
     * @param item the items to be added to the queue.
     */
    enqueue(...item: T[]): void {

        // check if the queue is at max capacity, and throw an error if it reaches max capacity
        if (this.size() === this.capacity) throw Error("Error! Queue has reached max capacity, you cannot add more items");

        // add new items to the storage
        this.storage.push(...item);
    }

    /**
     * Function to remove next item from the queue.
     * @returns The next item in the queue, or 'undefined' if the queue is empty
     */
    dequeue(): T | undefined {
        return this.storage.shift();
    }

    /**
     * Function to get the current size of the queue
     * @returns The current size of the storage as a number.
     */
    size(): number {
        return this.storage.length;
    }
}