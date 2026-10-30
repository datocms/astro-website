import chevronDownIcon from '~/icons/regular/chevron-down.svg?raw';
import plusIcon from '~/icons/regular/plus.svg?raw';
import trashIcon from '~/icons/regular/trash-can.svg?raw';

export const PlusIcon = () => <span dangerouslySetInnerHTML={{ __html: plusIcon }} />;
export const TrashIcon = () => <span dangerouslySetInnerHTML={{ __html: trashIcon }} />;
export const ChevronDownIcon = () => <span dangerouslySetInnerHTML={{ __html: chevronDownIcon }} />;
