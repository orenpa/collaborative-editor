self.onmessage = function (e) {
  try {
    const { userCode, args } = e.data;

    // Execute the user code with arguments
    const userFunction = new Function(...args, userCode);
    const result = userFunction(...args.map((arg) => arg.value));

    // Post the result back to the main thread
    self.postMessage(result);
  } catch (error) {
    self.postMessage({ error: error.message });
  }
};
