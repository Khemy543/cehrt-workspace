import pdf from '../assets/svgs/pdf.png';
import word from '../assets/svgs/word.svg';
import excel from '../assets/svgs/excel.svg'

const getIcon = (name) => {
    const extension = name.split('.').pop();

    switch (extension) {
        case 'pdf':
            return pdf;
        
        case 'docx':
            return word;
        
        case 'xlsx':
            return excel;
        default:
            return word;
    }
}

export {
    getIcon
}