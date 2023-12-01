import { Document,Page,pdfjs} from "react-pdf"
import React from "react"
import resume from "../PDFs/resume.pdf"
import { SizeMe} from "react-sizeme"




function Resume () {
    pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.js'


    return(
        <div className="Resume">
            <h2>
                Here is a <a href={resume} download={"Zachary Johnson Resume"}>link</a> to download my most recent Resume
            </h2>
        {/* /* {<SizeMe> */}
            {/* {({size})=>( */} 

                <Document file={resume} className={"resumePDF"}>
                <Page pageNumber={1}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                />
                <Page pageNumber={2}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                />
                </Document>
{/*                 
                )}
        </SizeMe>  */}
        
        
        </div>
    )
}
export default Resume