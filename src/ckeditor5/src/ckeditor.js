/**
 * @license Copyright (c) 2014-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */
import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor.js';
import Alignment from '@ckeditor/ckeditor5-alignment/src/alignment.js';
import Autoformat from '@ckeditor/ckeditor5-autoformat/src/autoformat.js';
import AutoImage from '@ckeditor/ckeditor5-image/src/autoimage.js';
import BlockQuote from '@ckeditor/ckeditor5-block-quote/src/blockquote.js';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold.js';
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials.js';
import Heading from '@ckeditor/ckeditor5-heading/src/heading.js';
import Image from '@ckeditor/ckeditor5-image/src/image.js';
import ImageCaption from '@ckeditor/ckeditor5-image/src/imagecaption.js';
import ImageUpload from '@ckeditor/ckeditor5-image/src/imageupload.js';
import Indent from '@ckeditor/ckeditor5-indent/src/indent.js';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic.js';
import Link from '@ckeditor/ckeditor5-link/src/link.js';
import List from '@ckeditor/ckeditor5-list/src/list.js';
import Mention from '@ckeditor/ckeditor5-mention/src/mention.js';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph.js';
import Table from '@ckeditor/ckeditor5-table/src/table.js';
import TableToolbar from '@ckeditor/ckeditor5-table/src/tabletoolbar.js';
import TextTransformation from '@ckeditor/ckeditor5-typing/src/texttransformation.js';
import userStory from '../../services/user_story';

class Editor extends ClassicEditor {}


var getFeedItems= async ( queryText ) => {

	const response = await userStory.getUsers()

	const users = response.data?.data?.users.map(user => {
		return { id: '@'+user.display,
		userId: user.id
	}
	})


            const itemsToDisplay = users
                .filter( isItemMatching )
                .slice( 0, 10 );

				console.log(itemsToDisplay)

			return itemsToDisplay;

    function isItemMatching( item ) {
        const searchString = queryText.toLowerCase();
        return (
            item.id.toLowerCase().includes( searchString )
        );
    }
}


function MentionCustomization( editor ) {
    // The upcast converter will convert view <a class="mention" href="" data-user-id="">
    // elements to the model 'mention' text attribute.
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
                // The mention feature expects that the mention attribute value
                // in the model is a plain object with a set of additional attributes.
                // In order to create a proper object use the toMentionAttribute() helper method:
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

    // Downcast the model 'mention' text attribute to a view <a> element.
    editor.conversion.for( 'downcast' ).attributeToElement( {
        model: 'mention',
        view: ( modelAttributeValue, { writer } ) => {
            // Do not convert empty attributes (lack of value means no mention).
            if ( !modelAttributeValue ) {
                return;
            }

            return writer.createAttributeElement( 'a', {
                class: 'mention',
                'data-mention': modelAttributeValue.id,
                'data-user-id': modelAttributeValue.userId,
                'href': 'profile/'+modelAttributeValue.userId
            }, {
                // Make mention attribute to be wrapped by other attribute elements.
                priority: 20,
                // Prevent merging mentions together.
                id: modelAttributeValue.userId
            } );
        },
        converterPriority: 'high'
    } );
}



// Plugins to include in the build.
Editor.builtinPlugins = [
	Alignment,
	Autoformat,
	AutoImage,
	BlockQuote,
	Bold,
	Essentials,
	Heading,
	Image,
	ImageCaption,
	ImageUpload,
	Indent,
	Italic,
	Link,
	List,
	Mention,
	Paragraph,
	Table,
	TableToolbar,
	TextTransformation,
	MentionCustomization
];

// Editor configuration.
Editor.defaultConfig = {
	toolbar: {
		items: [
			'heading',
			'|',
			'bold',
			'italic',
			'link',
			'bulletedList',
			'numberedList',
			'|',
			'outdent',
			'indent',
			'|',
			'imageUpload',
			'blockQuote',
			'insertTable',
			'undo',
			'redo'
		]
	},
	language: 'en',
	table: {
		contentToolbar: [
			'tableColumn',
			'tableRow',
			'mergeTableCells'
		]
	},
	mention: {
		feeds: [
			{
				marker: '@',
				feed: getFeedItems,
			}
		]
	}
};

export default Editor;
