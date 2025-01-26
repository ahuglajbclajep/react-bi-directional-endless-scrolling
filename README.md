# react-bi-directional-endless-scrolling

A Proof of Concept (PoC) for bi-directional endless scrolling and jumping to any item.
It includes implementations using [react-virtuoso](https://github.com/petyosi/react-virtuoso) and [virtua](https://github.com/inokawa/virtua), which can be tried [here](https://ahuglajbclajep.github.io/react-bi-directional-endless-scrolling/).

Below is an excerpt from the [virtua README](https://github.com/inokawa/virtua/blob/main/README.md#comparison), showing a feature comparison table of infinite scroll libraries.

|                                          | [virtua](https://github.com/inokawa/virtua) | [react-virtuoso](https://github.com/petyosi/react-virtuoso) | [react-window](https://github.com/bvaughn/react-window) | [@tanstack/react-virtual](https://github.com/TanStack/virtual) |
| ---------------------------------------- | ------------------------------------------- | ----------------------------------------------------------- | ------------------------------------------------------- | -------------------------------------------------------------- |
| Dynamic list size                        | ✅                                          | ✅                                                          | 🟠                                                      | ✅                                                             |
| Dynamic item size                        | ✅                                          | ✅                                                          | 🟠                                                      | 🟠                                                             |
| Reverse (bi-directional) infinite scroll | ✅                                          | ✅                                                          | ❌                                                      | ❌                                                             |
| Smooth scroll                            | ✅                                          | ✅                                                          | ❌                                                      | ✅                                                             |

- ✅ - Built-in supported
- 🟠 - Supported but partial, limited or requires some user custom code
- ❌ - Not officially supported

# License

MIT
