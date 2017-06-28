package dao.Role;

import java.util.List;
import java.util.Map;
import dao.baseDao.IBaseDao;
import util.connectUtil.*;
import util.operateObject.ObjectToSQL;

public class RoleDao extends CommonDAO implements IBaseDao{

	public int save(Object object) throws Exception{
		String sql = ObjectToSQL.toSqlForSave(object);
		executeSql(sql);
		return 1;		
	}
	
	public int update(Object object) throws Exception{
		String sql = ObjectToSQL.toSqlForUpdate(object);
		executeSql(sql);
		return 1;
	}
	
	public List<Map<String, Object>> getAllInfo() throws Exception{
		String sql = "select * from role";
		return excuteQuery(sql, null);
	}
	
	public List<Map<String, Object>> getInfoById(Long id) throws Exception{
		String sql = "select * from role where id = " + id;
		return excuteQuery(sql, null);
	}
	
	public int delete(Long id) throws Exception{
		String sql = "delete from role where id = " + id;
		executeSql(sql);
		return 1;
	}
}