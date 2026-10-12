import importlib.util
import pathlib
import unittest
p=pathlib.Path(__file__).resolve().parents[1]/'scripts/analyze-inventory.py'
s=importlib.util.spec_from_file_location('inventory',p)
m=importlib.util.module_from_spec(s)
s.loader.exec_module(m)

class InventoryTests(unittest.TestCase):
    def test_encodings_duplicates_and_identifiers(self):
        text='应用名称,Bundle ID,版本\r\n京东,com.360buy.jdmobile,001\r\n京东,com.360buy.jdmobile,001\r\n'
        for encoding in ['utf-8','utf-8-sig','utf-16','gb18030']:
            rows,stats=m.parse(text.encode(encoding))
            self.assertEqual(len(rows),1)
            self.assertEqual(rows[0]['版本'],'001')
            self.assertEqual(stats['duplicates'],1)
            self.assertEqual(m.analyze(rows)[0]['当前验证状态'],'excluded')
    def test_bad_header_and_missing_bundle(self):
        for t in ['name,id,version\na,b,c\n','应用名称,Bundle ID,版本\na,,1\n']:
            with self.assertRaises(ValueError):m.parse(t.encode())
    def test_conflict_and_protected_media(self):
        rows,stats=m.parse('应用名称,Bundle ID,版本\nInfuse,com.firecore.infuse,8\nInfuse,com.firecore.infuse,9\n'.encode())
        self.assertEqual(stats['conflicting_bundle_ids'],['com.firecore.infuse'])
        self.assertEqual(m.analyze(rows)[0]['当前验证状态'],'excluded')
    def test_explicit_independent_exclusions(self):
        rows=[{'应用名称':n,'Bundle ID':'test.'+str(i),'版本':'1'} for i,n in enumerate(m.EXPLICIT)]
        self.assertTrue(all(r['当前验证状态']=='excluded' and r['建议方案']=='不处理' for r in m.analyze(rows)))
if __name__=='__main__':unittest.main()
