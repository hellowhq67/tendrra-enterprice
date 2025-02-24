import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";

interface ResearchResultsProps {
    results: {
        [key: string]: any;
    }
}


const ResearchResults: React.FC<ResearchResultsProps> = ({results}) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
            {
             Object.keys(results).length > 0 ? Object.keys(results).map((key) => (
                    <Card key={key}>
                    <CardHeader>
                        <CardTitle>{key}</CardTitle>
                        <CardDescription>{format(new Date(), "MMM dd yyyy")}</CardDescription>
                    </CardHeader>
                    <CardContent className="text-sm">
                        { typeof results[key] === 'string' ? <p>{results[key]}</p> : <pre>{JSON.stringify(results[key], null, 2)}</pre> }
                    </CardContent>
                    </Card>
                ))
                : <p className="text-center text-gray-500">No results yet.</p>
            }
        </div>
    )
}

export default ResearchResults;