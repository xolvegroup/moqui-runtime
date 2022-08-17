                        function MentionCustomization( editor ) {
    editor.conversion.for( 'upcast' ).elementToAttribute( {
        view: {
            name: 'a',
            key: 'data-mention',
            classes: 'mention',
            attributes: {
                href: true,
                'data-user-id': true
            }
        },
        model: {
            key: 'mention',
            value: viewItem => {
                const mentionAttribute = editor.plugins.get( 'Mention' ).toMentionAttribute( viewItem, {
                    // Add any other properties that you need.
                    link: viewItem.getAttribute( 'href' ),
                    userId: viewItem.getAttribute( 'data-user-id' )
                } );

                return mentionAttribute;
            }
        },
        converterPriority: 'high'
    } );

    editor.conversion.for( 'downcast' ).attributeToElement( {
        model: 'mention',
        view: ( modelAttributeValue, { writer } ) => {
            if ( !modelAttributeValue ) {
                return;
            }

            return writer.createAttributeElement( 'a', {
                class: 'mention',
                'data-mention': modelAttributeValue.id,
                'data-user-id': modelAttributeValue.userId,
                'href': modelAttributeValue.link
            }, {
                priority: 20,
                id: modelAttributeValue.uid
            } );
        },
        converterPriority: 'high'
    } );
}

var items = [];
function formatUserList(resp) {
    resp.forEach(function(item){
       items.push({id: "@" + (item.name.split(": ")[1]).replaceAll(" ", "").toLowerCase(), userId: item.partyId, name: item.name.split(": ")[1]})
    })
}
var allParms = $.extend({ moquiSessionToken:$("#confMoquiSessionToken").val(), treeNodeId:'#', treeOpenPath:this.openPath }, this.parameters);
$.ajax({ type:'POST', dataType:'json', url: "/apps/hm/Task/EditUsers/getProjectParties", headers:{Accept:'application/json'}, data:allParms,
    error:moqui.handleAjaxError, success:function(resp) { formatUserList(resp); } });

// const items = [
//     { id: '@swarley', userId: '1', name: 'Barney Stinson', link: 'https://www.imdb.com/title/tt0460649/characters/nm0000439' },
//     { id: '@lilypad', userId: '2', name: 'Lily Aldrin', link: 'https://www.imdb.com/title/tt0460649/characters/nm0004989' },
//     { id: '@marry', userId: '3', name: 'Marry Ann Lewis', link: 'https://www.imdb.com/title/tt0460649/characters/nm1130627' },
//     { id: '@marshmallow', userId: '4', name: 'Marshall Eriksen', link: 'https://www.imdb.com/title/tt0460649/characters/nm0781981' },
//     { id: '@rsparkles', userId: '5', name: 'Robin Scherbatsky', link: 'https://www.imdb.com/title/tt0460649/characters/nm1130627' },
//     { id: '@tdog', userId: '6', name: 'Ted Mosby', link: 'https://www.imdb.com/title/tt0460649/characters/nm1102140' }
// ];

function getFeedItems( queryText ) {
    return new Promise( resolve => {
        setTimeout( () => {
            const itemsToDisplay = items
                .filter( isItemMatching )
                .slice( 0, 10 );

            resolve( itemsToDisplay );
        }, 100 );
    } );

    function isItemMatching( item ) {
        const searchString = queryText.toLowerCase();

        return (
            item.name.toLowerCase().includes( searchString ) ||
            item.id.toLowerCase().includes( searchString )
        );
    }
}

function customItemRenderer( item ) {
    return item.name + " " + item.id;
}

function getMentionedUsers() {
    var mentioned_users = [];
    var parser = new DOMParser();
    var mentionDoc = parser.parseFromString(editor.getData(), 'text/html');
    var mentionedElements = mentionDoc.getElementsByClassName('mention')
    for (let i=0; i < mentionedElements.length; i++){
        let user = mentionedElements[i].getAttribute("data-mention");
        if (!mentioned_users.includes(user)) {
            mentioned_users.push(user)
        }
    }
    console.log(mentioned_users);
}
