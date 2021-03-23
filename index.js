import { Plugin } from '@vizality/entities';
import { patch, unpatch } from '@vizality/patcher';
import { getModule } from '@vizality/src/core/modules/webpack';

const getWantedHandler = (mod) => mod._orderedActionHandlers.MESSAGE_DELETE.find((x) => x.actionHandler.toString().includes('revealedMessageId'));
let deleted = [];
let original;
let interval;
let index = 0;

const run = () => {
  for (let obj of deleted) {
	styleMessage(obj);
  }
};

const styleMessage = async ({ id }) => {
  let el = document.getElementById(`chat-messages-${id}`);
  if (!el) return;
  
  if (el.classList.contains('gm-deleted-message')) return;
  
  el.classList.add('gm-deleted-message');
  el.style.backgroundColor = 'rgba(240, 71, 71, 0.1)';
  el.getElementsByClassName('contents-2mQqc9')[0].getElementsByClassName('markup-2BOw-j messageContent-2qWWxC')[0].innerHTML = this.settings.get('deleted-message-message', false) || "This message has been deleted"
};

export default class NoMessageDelete extends Plugin {
  async start () {
	const deleteMessage = await getModule([ 'register' ])

	try {
		original = getWantedHandler(deleteMessage);
	  } catch (e) {
		console.log('Better Message Deletion: Setup failed, retrying...');
		console.log(e)
		return setTimeout(this.start, 3000);
	}
	
	index = deleteMessage._orderedActionHandlers.MESSAGE_DELETE.indexOf(getWantedHandler(deleteMessage));

	deleteMessage._orderedActionHandlers.MESSAGE_DELETE[index] = {
      actionHandler: (obj) => {
      	// console.log(obj);

        if (deleted.find((x) => x.id === obj.id)) { return; }
      
        deleted.push(obj);

        styleMessage(obj);
      },

      storeDidChange: function() { }
    };

	console.log('Better Message Deletion: Ready');
  }

  stop () {
    clearInterval(interval);

    for (let e of document.getElementsByClassName('gm-deleted-message')) {
      e.remove();
    }

    getModule([ 'register' ])._orderedActionHandlers.MESSAGE_DELETE[index] = original;
  }
}