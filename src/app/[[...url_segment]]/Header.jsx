import Link from 'next/link'
import SignButton from '@/components/SignButton'

export default function Header({ params: segment }) {
    if (!segment) {
        return (
            <div className="flex justify-between">
                <div className="flex flex-col justify-center">
                    <h1 className="text-3xl align-middle">
                        <Link href='/'>Root/</Link>
                    </h1>
                </div>
                <div></div>
                <div><SignButton /></div>
            </div>
        )
    }
    else {
        const dir_style = { paddingRight: '0.5em' }

        return (
            <div className="flex justify-between">
                <div className="flex flex-col justify-center">
                    <h1 className="text-3xl align-middle">
                        {<span key='0' style={dir_style}><Link href='/'>Root/</Link></span>}
                        {segment.map((item, index) => {
                            const cur_link = segment.slice(0, index + 1).join('/') + ' ';
                            //const slash = segment.length - 1 != index ? '/' : '';
                            const slash = 0 != index ? '/' : ':';
                            return <span key={index + 1} style={dir_style}><Link href={'/' + cur_link}>{item}{slash}</Link></span>;
                        })}
                    </h1>
                </div>
                <div></div>
                <div><SignButton /></div>
            </div>
        )
    }
}
