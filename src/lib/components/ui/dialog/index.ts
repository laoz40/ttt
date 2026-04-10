import { Dialog } from "bits-ui";

import Content from "./dialog-content.svelte";
import Description from "./dialog-description.svelte";
import Header from "./dialog-header.svelte";
import Title from "./dialog-title.svelte";

const Root = Dialog.Root;
const Trigger = Dialog.Trigger;
const Portal = Dialog.Portal;
const Overlay = Dialog.Overlay;
const Close = Dialog.Close;

export {
	Close,
	Content,
	Description,
	Header,
	Overlay,
	Portal,
	Root,
	Title,
	Trigger,
};
